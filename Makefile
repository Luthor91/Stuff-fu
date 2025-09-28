PYTHON := python3.11
PORT := 8000

GIT_REPO := https://github.com/Luthor91/Wakbuild.git

.PHONY: serve

# Commande pour démarrer
serve:
	@echo "Starting server on http://127.0.0.1:$(PORT)"
	$(PYTHON) -m http.server $(PORT)

deploy: 
	@git add docs/*
	@git add Makefile
	@git add README.md
	@git commit -m "update"
	@git push $(GIT_REPO)


# Cible pour nettoyer les fichiers générés
clean:
	@echo "Cleaning up..."