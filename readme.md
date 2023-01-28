# Bot Discord OpenAI
## **Présentation**

Ce bot est relié à OpenAI et vous offre la possibilité de discuter avec lui par chat textuel et d'avoir vos réponses soit par texte, soit par vocal dans un channel discord via l'API Text-to-speech de Voice RSS.

<br>


## **Prérequis**

Posséder une clef API pour :
- OpenAI
- Votre bot Discord
- Voice RSS

<br>

## **Mise en place du projet**

<br>

Commencer par cloner le projet dans le répertoire de votre choix et ensuite pour installer les dépendances du projet faire :  
```
npm install
```


Ensuite, créer un fichier env.js à la racine du projet :

```javascript
var token = {
    tokenAPI: "VOTRE TOKEN OPEN API",
    tokenBot: "VOTRE TOKEN BOT DISCORD",
    tokenVoice: "VOTRE TOKEN VOICE RSS",
};
module.exports = { token }
```

Pour lancer le projet, dans un terminal à la racine du repertoire :
```
node index.js
```

## **Explications**

<br>

### **Discuter par chat écrit**

Ce bot est conçu pour répondre aux utilisateurs via le chat écrit mais aussi via le chat vocal. Pour lui poser une question et avoir une réponse via le chat écrit, il faut mentionner le bot `@VotreBOT` suivi de la question que vous voulez lui poser ou de la complétion que vous souhaitez avoir.

*Exemple: @Bot Ecrit moi un poème sur la solitude*

Si vous souhaitez générer des images, mentionner le bot `@VotreBot` suivi du mot `Génère`.

*Exemple : @Bot Génère un cheval qui cours sur la plage*


<br>

### **Discuter par chat vocal**

Pour faire rejoindre le Bot dans un channel vocal, entrez dans le chat textuel de celui-ci, mentionnez le bot avec la commande `!join`

Pour le faire quitter le channel mentionnez le bot avec la commande `!quit`

Pour faire parler le bot dans le chat vocal, il suffit maintenant de le mentionner dans le chat textuel du chat en posant votre question ou en proposant une complétion.


<br>

### **Paramètres de conversation**



Dans sa version actuelle, le bot retiens les 3 derniers messages de votre conversation, pour pouvoir être cohérent et tenir une conversation avec vous. Vous pouvez tout à fait changer le nombre de messages retenu en modifiant la variable `nbMess` ligne 30.

```javascript
let nbMess = 3 // Changer la valeur ici
```

Ce choix à été fait pour minimiser le nombre de tokens envoyés/générés par l'API afin de diminuer les coûts. Sachez que si vous choisissez d'enregistrer tout les messages, vous être sujet à d'énorme frais de la part de l'API OpenAI.

Le bot à besoin d'un contexte pour assurer au mieux le rôle que vous voulez lui donner. Actuellement, son contexte lui demande d'être un bot qui répond aux questions tout en étant créatif. Vous pouvez changer ce context en modifiant la variable `context` ligne 27

```javascript
let context = 'Tu dois répondre aux questions et te montrer créatif\n' //Changer le context ici en terminant par \n
```

