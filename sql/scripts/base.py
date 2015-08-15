#!/usr/bin/env python
# encoding: utf-8
from __future__ import absolute_import, division, print_function, unicode_literals
import MySQLdb.cursors
import logging
import copy
import sys
import argparse
from concurrent.futures import ThreadPoolExecutor

LOG = logging.getLogger('script_bd')

class UpdateScriptV1(object):
    # Precisa ser definido
    INITIAL_QUERY = None

    def task(self, oferta):
        raise RuntimeError("Not implemented")

    #### Funções base ####
    def __init__(self, host, db, user, passwd, dry_run=False, auto_rollback=False, workers=10, limit=0):
        self.connections_options = {
            "use_unicode": True,
            "cursorclass": MySQLdb.cursors.SSCursor,
            "passwd": passwd,
            "host": host,
            "charset": "utf8",
            "db": db,
            "user": user
        }
        self.dry_run = dry_run
        self.auto_rollback = auto_rollback
        self.__connection__ = None
        self.workers = workers
        self.limit = limit

    def run(self):
        resultados = []
        with ThreadPoolExecutor(max_workers=self.workers) as pool:
            for i, obj in enumerate(self.query(self.INITIAL_QUERY)):
                if self.limit > 0 and i >= self.limit:
                    break

                # FIXME Estou tendo que clonar o objeto para não compartilhar a conexão
                resultados.append(pool.submit(lambda obj: copy.copy(self).perform(obj), obj))
        total = len(resultados)
        qtde_erros_de_execucao = len([False for r in resultados if r.result() is False])
        return (total, qtde_erros_de_execucao)

    def perform(self, obj):
        self.clear_connection(close=False)
        try:
            self.begin()
            self.task(obj)
            if self.auto_rollback:
                self.rollback()
            else:
                self.commit()
            return True
        except:
            LOG.exception("Error processing task %s", obj)
            self.rollback()
            return False
        finally:
            self.clear_connection()

    @property
    def connection(self):
        if self.__connection__ is None:
            self.__connection__ = self.new_connection()
        return self.__connection__

    def clear_connection(self, close=True):
        if close and not (self.__connection__ is None):
            # try close connection
            try:
                self.__connection__.close()
            except:
                pass
        self.__connection__ = None

    def new_connection(self):
        LOG.debug("Conectando no banco %s", self.connections_options['host'])
        db = MySQLdb.connect(**self.connections_options)
        return db

    def query(self, query, unique=False):
        """ Returna o resultado da query como lista com dicionário. Se unique=True, retorna apenas 1 elemento em vez da lista """
        cursor = self.connection.cursor()
        LOG.debug("Executando select\n%s", self.format_sql(query))
        cursor.execute(query)
        result = self.dictfetchall(cursor)
        if unique:
            result = result[0] if result else None
        return result

    def execute(self, query, values=None):
        cursor = self.connection.cursor()
        if values:
            LOG.debug("Executando query\n%s", self.format_sql(query % tuple(map(repr, values))))
        else:
            LOG.debug("Executando query\n%s", self.format_sql(query))
        if not self.dry_run:
            cursor.execute(query, values)
        return cursor

    def update(self, tabela, dados, where, ignorar=[]):
        campos = list(set(dados.keys()) - set(ignorar))
        parte_set = ", ".join(["%s = %%s" % (campo,) for campo in campos])
        valores = [dados[campo] for campo in campos]
        query = "UPDATE %s SET %s WHERE %s;" % (tabela, parte_set, where)
        self.execute(query, valores)

    def insert(self, tabela, dados, id=None, ignorar=[]):
        campos = list(set(dados.keys()) - set(ignorar))
        if id:
            campos.remove(id)
        parte_into = ", ".join([campo for campo in campos])
        parte_values = ", ".join(["%s" for campo in campos])
        valores = [dados[campo] for campo in campos]
        query = "INSERT INTO %s(%s) VALUES (%s);" % (tabela, parte_into, parte_values)
        cursor = self.execute(query, valores)
        if id:
            last_id = cursor.lastrowid
            LOG.debug("Inserido em %s com id %s", tabela, last_id)
            dados[id] = last_id

    def duplica(self, tabela, id, where, substituir):
        """ Le dados da tabela (com where) e reinsere eles substituindo os valores do dicionário """
        row = None
        for row in self.query("select * from %s where %s" % (tabela, where)):
            row.update(substituir)
            self.insert(tabela, row, id=id)
        return row

    def begin(self, force=False):
        if not self.auto_rollback or force:
            self.execute("START TRANSACTION")

    def commit(self, force=False):
        if not self.auto_rollback or force:
            self.execute("COMMIT")

    def rollback(self, force=False):
        if not self.auto_rollback or force:
            self.execute("ROLLBACK")

    def dictfetchall(self, cursor):
        "Returns all rows from a cursor as a dict"
        desc = cursor.description
        for linha, row in enumerate(cursor.fetchall()):
            columns = dict(zip([col[0] for col in desc], row))
            LOG.debug("=> (%d) %s", linha+1, "; ".join(["%s=%s" % (k,repr(v)) for k,v in columns.items()]))
            yield columns

    def format_sql(self, sql):
        return sql

def run(cls):
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", help="increase output verbosity", action="store_true")
    parser.add_argument("--dry-run", help="executa as queries que não são select", action="store_true")
    parser.add_argument("--rollback", help="executa as queries que não são select", action="store_true")
    parser.add_argument("--passwd", required=True)
    parser.add_argument("--user", required=True)
    parser.add_argument("--host", required=True)
    parser.add_argument("--db", required=True)
    parser.add_argument("--workers", default=10, type=int)
    parser.add_argument("--limit", default=0, help="Limita o número de tarefas a executar", type=int)
    args = parser.parse_args()

    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format="%(name)s:%(lineno)s \t %(message)s\n")
    us = cls(host=args.host, db=args.db, user=args.user, passwd=args.passwd, dry_run=args.dry_run, auto_rollback=args.rollback, workers=args.workers, limit=args.limit)
    total, qtde_errors = us.run()
    LOG.info("Processado %d objetos com %d erros", total, qtde_errors)
    if qtde_errors > 0:
        # houveram erros de processamento
        sys.exit(3)
    sys.exit(0)
