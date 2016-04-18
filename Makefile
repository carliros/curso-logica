
all: stack hakyll

stack:
	stack build

hakyll:


clean:
	rm -r $(BUILD)

.PHONY: all book clean epub html pdf
