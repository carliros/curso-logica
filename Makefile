
all: stack hakyll

stack:
	stack build
	stack exec curso-logica build


hakyll:


clean:
	stack exec curso-logica clean
	stack clean

.PHONY: all
