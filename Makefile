-include .ruslan.mk

start: node_modules
	yarn $@

dev: node_modules
	yarn run $@

node_modules:
	yarn install

