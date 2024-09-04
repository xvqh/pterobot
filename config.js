module.exports = {
    token: "", // token bot
    color: "#FFFFFF", // couleur blanc
    owners: ["", ""], // id owner
    roleclient: "", // role client

    ptero: {
        link: "", // url panel
       	key: "", // key ptero
        startup: {
            nodejs: '', // startup node js
            python: '' // startup python
        },

        docker_image: {
            nodejs: "", // docker nodejs
            python: "" // docker python
        },

        eggs: {
            nodejs: 0, // id egg node js
            python: 0 // id egg python
        },

        environnement: {
            PY_FILE: "app.py", // fichier principal python
            MAIN_FILE: "index.js",// fichier principal node js
            REQUIREMENTS_FILE: "requirements.txt"// install requirement
        },

        limits: {
            memory: 0, // mémoire serveur 
            swap: 0, // swap serveur
            disk: 0, // disk espace serveur
            io: 500, // io serveur
            cpu: 0 // cpu des serveurs
        }
    }
}