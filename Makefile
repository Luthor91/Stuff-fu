PYTHON := python3.11
PORT := 8000

GIT_REPO := https://github.com/Luthor91/Stuff-fu.git
BRANCH ?= main
REMOTE ?= origin

.PHONY: deploy

# Commande pour démarrer
serve:
	@echo "Starting server on http://127.0.0.1:$(PORT)"
	$(PYTHON) -m http.server $(PORT)

deploy:
	@echo "Fetching last changes from GitHub..."
	@git pull --rebase --autostash $(GIT_REPO) $(BRANCH)
	@echo "Deploying to GitHub..."
	@git add docs Makefile README.md
	@git commit -m "update" || echo "Nothing to commit"
	@git push $(GIT_REPO) HEAD:$(BRANCH)


# Cible pour nettoyer les fichiers générés
clean:
	@echo "Cleaning up..."