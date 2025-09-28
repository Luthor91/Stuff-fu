PYTHON := python3.11
PORT := 8000

PATH_SRC := utils/src/js
EXCEL_FILE := utils/data.xlsx
PARSING_SCRIPT := "$(PATH_SRC)/parsing.js"
OUTPUT_JSON := utils/class_data.json

GIT_REPO := https://github.com/Luthor91/Wakbuild.git

.PHONY: serve

# Commande pour démarrer
serve:
	@echo "Starting server on http://127.0.0.1:$(PORT)"
	$(PYTHON) -m http.server $(PORT)

deploy: 
	@git add .
	@git commit -m "update"
	@git push $(GIT_REPO)


# Cible pour nettoyer les fichiers générés
clean:
	@echo "Cleaning up..."