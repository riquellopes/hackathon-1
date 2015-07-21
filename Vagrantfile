# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  	# Every Vagrant virtual environment requires a box to build off of.
	config.vm.box = "box_hackathon"
	config.vm.box_url = "https://dl.dropboxusercontent.com/u/6032045/Box/ubuntu-14.04-amd64-vbox.box" 
	config.vm.network "private_network", ip: "10.0.0.12"
	config.vm.provision :shell, path: "bootstrap.sh"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder ".", "/home/vagrant/hackathon"  

	config.vm.provider :virtualbox do |vb|
        	vb.name = "Hackathon-Descomplica"
        	vb.customize ["modifyvm", :id, "--memory", "1024"]
        	vb.customize ["modifyvm", :id, "--cpus", "2"]
	end

end
