# Dumb Task Manager

# MDV - Tests et sécurité des applications - PROJET

## Phase 1 - Observation

### 1.1 - Test manuel de l'app Individuel

#### État du front

##### Page d'accueil

| **Aspect**                  | **Problème détecté**                                                                                          | **Suggestions d'amélioration**                                                                                           |
|-----------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Design (UI)**             | - Couleur de fond trop vive                                                      | - Utiliser une couleur plus douce en arrière-plan.                                                                              |
|                             | - Positionnement désordonné des éléments (texte en haut à gauche).                                           | - Centrer ou aligner correctement le texte.                                                                               |
| **Manque d'identité visuelle** | - Absence de logo                                            | - Ajouter un logo ou une bannière en haut de la page.                                                                    |
|                             | - Aucun élément structurant pour organiser le contenu.                                                       | - Ajouter des sections ou des séparations visuelles pour structurer la page.                                             |
| **Accessibilité**           | - Contraste insuffisant entre le texte noir et le fond bleu pour les personnes ayant des déficiences visuelles.| - Améliorer le contraste pour respecter les normes d'accessibilité (WCAG).                                               |
|                             | - Pas de support pour les lecteurs d'écran ni de navigation alternative.                                     | - Ajouter des balises ARIA et indiquer les raccourcis claviers.                                                          |
| **Expérience utilisateur (UX)** | - Le lien "go to login page" n'est pas présenté comme un bouton, ce qui peut être confus.                    | - Transformer le lien en bouton bien visible avec un design clair.                                                       |
|                             | - Message d'accueil peu informatif ("Welcome to DTM! (Dumb Task Manager)").                                  | - Ajouter une courte description expliquant les fonctionnalités ou l’objectif de l'application.                         |
|                             | - Absence d'explication, on ne sait pas pourquoi on doit se connecter                                 |       - Ajouter une phrase expliquant la raison ou les avantages de la connexion.               |                                                              | 
|                             | - On ne peut pas se déconnecter                                |       - Ajouter un bouton de déconnection.               |                                                              | 
|                             | - Le numéro de tâche correspond à l'id de la tâche et non le numéro de la tâche créer par l'utilisateur                                |       - Il faut utiliser le numéro de la tâche crée par l'utilisateur    |                                                              | 
|                             | - Task completed est inutile                                |       - Il n'y a aucun indicateur pour dire si la tâche est faite où non               |                                                              | 

##### Page d'inscription et de connexion

| **Aspect**                  | **Problème détecté**                                                                                                   | **Suggestions d'amélioration**                                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Design (UI)**             | - Couleur de fond turquoise trop vive, similaire à la page d'accueil.                                                | - Utiliser une couleur plus douce.                                                                                       |
|                             | - Alignement des champs incorrect : les champs de formulaire sont alignés horizontalement, rendant la lecture difficile.| - Aligner verticalement les champs pour une meilleure lisibilité et organisation.                                        |
|                             | - Bouton "Register!" peu visible et non attractif.                                                                   | - Utiliser un bouton plus grand avec un design clair et attractif.                                                       |
| **Accessibilité**           | - Pas d'indication sur les formats attendus (ex. email, mot de passe, etc.).                                           | - Ajouter des placeholders ou des labels expliquant les formats requis (ex. "Enter a valid email").                      |
|                             | - Absence de contrôle de saisie ou de messages d'erreur en cas de données incorrectes ou incomplètes.                  | - Implémenter une validation des champs et afficher des messages d'erreur clairs et descriptifs.                         |
| **Expérience utilisateur (UX)** | - Pas d'informations sur l’objectif de l'inscription ou sur ce qui se passe après.                                      | - Ajouter une explication claire du processus d'inscription et des étapes suivantes.                                     |
|                             | - L'utilisateur peut saisir des données invalides ou incomplètes sans avertissement.                                  | - Vérifier les champs avant soumission (ex. email valide, mot de passe suffisamment long).                                |
|                             | - La connexion au serveur échoue, entraînant une erreur générique.                                                    | - Vérifier si le serveur est en cours d'exécution et si les ports sont configurés correctement (par défaut `localhost:3000`). |
|                             | - Le formulaire d'inscription utilise la méthode GET, exposant les données sensibles dans l'URL.                      | - Utiliser la méthode POST pour transmettre les données de manière sécurisée.                                            |
|                             | - Dans le champ "mot de passe", le texte saisi est visible en clair.                                                  | - Configurer le champ "mot de passe" pour masquer le texte à l'aide de l'attribut `type="password"`.                     |
|                             | - Champ "confirmation mot de passe" manquant.                                                                        | - Ajouter un champ de confirmation pour que l'utilisateur puisse vérifier la saisie de son mot de passe.                 |
| **Fonctionnalité**          | - Pas de contrôle sur les champs de saisie, aucune validation des données (ex. email non valide accepté).              | - Ajouter une validation côté client (JS) et côté serveur pour empêcher l'envoi de données incorrectes.                  |
|                             | - La connexion échoue car le serveur semble inaccessible, mal configuré ou une erreur sur les champs envoyés par le formulaire. | - Assurer que le serveur est démarré correctement, que les routes sont configurées, que les dépendances sont installées et que les données sont correctement utilisées. |
|                             | - Aucun retour en cas de succès ou d'échec sur la page d'inscription.                                                 | - Afficher un message de confirmation pour une inscription réussie ou des erreurs si elle échoue.                        |

### 1.2 - Tentatives d'attaque de l'app Individuel

| **Méthode d'Attaque**       | **Description**                                                                                                                                              | **Résultat**                                                                                              | **Solution Proposée**                                                                                                                                                                                                                                                                                       |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **BAC (Bypass Access Control)** | Accès à la page admin sans authentification.                                                                                                              | Possible : La page est accessible directement sans vérification.                                         | Ajouter un middleware d'authentification                                           |
|                             |                                                                                                                                                              |                                                                                                          | Implémenter un contrôle des rôles pour l'accès admin                                                                                                                             |
| **Suppression de tâches sans authentification** | Les tâches d’un utilisateur peuvent être modifiées ou supprimées sans authentification.                                                             | Possible : Les requêtes ne vérifient pas si l'utilisateur est connecté et autorisé.                      | Ajouter une vérification d'autorisation                             |
| **CSRF (Cross-Site Request Forgery)** | Requête envoyée via un formulaire externe pour supprimer une tâche sans l’autorisation de l’utilisateur.                                               | Possible : Test réussi avec le formulaire suivant : ```html<br><!DOCTYPE html><br><html lang="fr"><br><head><br>    <meta charset="UTF-8"><br>    <title>Test CSRF</title><br></head><br><body><br>    <form action="http://localhost:3000/tasks/remove" method="GET"><br>        <input type="hidden" name="taskId" value="1"><br>        <input type="hidden" name="userId" value="1"><br>        <button type="submit">Envoyer</button><br>    </form><br></body><br></html><br>``` | Configurer les cookies avec `SameSite=Lax` ou `SameSite=Strict` Ajouter un token CSRF |
| **XSS (Cross-Site Scripting)** | Injection de code JavaScript malveillant dans les entrées utilisateur pour exécuter des scripts sur d'autres utilisateurs.                                  | Aucun vecteur exploitable trouvé : Les entrées semblent protégées contre les injections.                 |                                                                                   |
| **Injection SQL**           | Test avec `sqlmap` pour vérifier les vulnérabilités sur les paramètres dans les requêtes SQL.                                                                | Aucun vecteur exploitable trouvé : Les requêtes semblent sécurisées.                                     |                                                                                              |


### 1.3 - Etat de la codebase Individuel
#### Models
| **Problème**              | **Description**                                                                                                                                         | **Solution**                                                                                                                                                                   |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Connexion à la base de données** | Connexion répétée dans chaque fichier, ce qui entraîne une duplication.                                                                                  | Centraliser la connexion dans un fichier comme `app.js` et l'importer où nécessaire.                                                                                        |
| **Validation des entrées**        | Absence de validation des paramètres pour les méthodes, ce qui rend le code vulnérable aux erreurs et à la mauvaise utilisation.                        | Valider systématiquement les entrées avec conditions explicites.                                                      |
| **Gestion des erreurs**           | Plusieurs méthodes ne gèrent pas correctement les erreurs (ex. : ne pas transmettre l'erreur dans le `callback` ou laisser des erreurs silencieuses).   | Respecter la convention `callback(err, result)` pour toutes les méthodes. Toujours vérifier et transmettre les erreurs.                                                     |
| **Prévention des injections SQL** | Certaines requêtes utilisent des concaténations de chaînes pour intégrer des paramètres, ce qui ouvre la porte aux injections SQL.                      | Utiliser des requêtes paramétrées pour toutes les interactions avec la base de données.                                                                                     |
| **Logging**                       | Usage de `console.log` et `console.error` pour gérer les logs, ce qui n’est pas adapté pour la production.                                              | Adopter une bibliothèque de journalisation comme `winston` un suivi structuré des erreurs et des événements (recevoir un email dès qu'il y a une erreur).                                                |
| **Mot de passe en clair**         | Le fichier `User.js` compare les mots de passe directement, sans utiliser de hash sécurisé.                                                            | Implémenter un hashage des mots de passe avec des outils comme `bcrypt` pour sécuriser l’authentification.                                                                  |

#### Views 
| **Problème**                                           | **Description**                                                                                                                                           | **Solution**                                                                                                   |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Absence de vérification des entrées côté client**    | Il n'y a aucune vérification ou validation des champs de formulaire côté client, ce qui permet à l'utilisateur de soumettre des données incorrectes ou incomplètes. | Ajouter une validation des entrées côté client en JavaScript pour s'assurer que les données sont correctes avant l'envoi.  |
| **Absence de lien entre les `<label>` et les `<input>`** | Les labels ne sont pas associés aux champs de formulaire, ce qui nuit à l’accessibilité pour les utilisateurs et les outils comme les lecteurs d’écran.   | Ajouter l’attribut `for` aux `<label>` et lui assigner l’`id` correspondant des `<input>`.                     |
| **Méthodes des formulaires sensibles**                 | Les formulaires sensibles comme la connexion ou l’enregistrement utilisent une méthode `GET` au lieu de `POST`, exposant les données dans l'URL.          | Utiliser la méthode `POST` pour tous les formulaires contenant des données sensibles comme les mots de passe. |
| **Messages d’erreur utilisateur absents**              | Pas de retour visuel sur les erreurs pour guider les utilisateurs en cas de problème (ex. : champ obligatoire non rempli).                                | Implémenter des messages d’erreur clairs à afficher sous ou près des champs concernés.                         |
| **Manque d'instructions dans les formulaires**         | Les formulaires manquent d’indications claires sur le format attendu (ex. : mot de passe, email, etc.).                                                   | Ajouter des `placeholder`, des descriptions ou des info-bulles pour guider les utilisateurs.                  |
| **La mise en commun des balises**         | Des sections comme le header sont dupliquées dans plusieurs fichiers, ce qui complique les mises à jour et la gestion des modifications.                                                 | Regrouper les balises dans des fichiers communs.                  |

#### app.js

| **Problème**                                               | **Description**                                                                                                                                                               | **Solution**                                                                                                      |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Utilisation de `var` au lieu de `let` ou `const`**        | L'utilisation de `var` pour déclarer des variables peut entraîner des problèmes de portée (scope) et des comportements inattendus dans le code.                                 | Remplacer `var` par `let` ou `const` en fonction de la nécessité de redéclarer la variable.                        |
| **Gestion des cookies et des attaques CSRF**               | La gestion des sessions via `express-session` peut être vulnérable aux attaques CSRF si les cookies ne sont pas correctement sécurisés.                                         | Ajouter des options de sécurité aux cookies (ex. : `httpOnly: true`, `secure: true`, `sameSite: 'strict'`) pour limiter les risques de CSRF et garantir que les cookies sont uniquement envoyés par des connexions HTTPS. |
| **Sécurisation des cookies de session**                    | Les cookies de session peuvent être interceptés ou volés s'ils ne sont pas configurés correctement.                                                                          | Configurer `cookie.secure = true` et `cookie.httpOnly = true` dans les options de session pour sécuriser les cookies. |
| **Mauvaise gestion des erreurs**                            | Aucune gestion des erreurs en cas de requêtes échouées ou de problème de session, ce qui peut entraîner une mauvaise expérience utilisateur.                                    | Ajouter un gestionnaire d'erreurs global pour gérer les erreurs et rendre l'application plus robuste.               |

#### Routes

| **Problème**                                                 | **Description**                                                                                                                                                               | **Solution**                                                                                                      |
|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Utilisation de `var` dans les routes**                     | L'utilisation de `var` dans les routes peut entraîner des problèmes de portée (scope) et des comportements inattendus dans le code.                                             | Remplacer `var` par `let` ou `const` dans toutes les déclarations de variables dans les routes.                  |
| **Validation des données (`req.body` ou `params`)**          | Il n'y a aucune vérification des données reçues dans les requêtes (par exemple `req.body` ou `req.params`), ce qui peut entraîner l'insertion ou l'utilisation de données incorrectes. | Ajouter des validations pour vérifier la cohérence des données reçues dans `req.body` ou `req.params`. Utiliser des bibliothèques comme `express-validator` ou des vérifications manuelles pour s'assurer que les données sont valides. |
| **Absence de messages d'erreur pour les données invalides**  | Lorsqu'une donnée est manquante ou incorrecte, il n'y a pas de retour d'erreur clair pour l'utilisateur.                                                                     | Retourner des messages d'erreur explicites lorsque les données sont invalides (par exemple, "Email invalide" ou "Mot de passe manquant"). |
| **Manque de protection des routes sensibles**                | Certaines routes sensibles, comme la connexion ou l'inscription, ne sont pas protégées contre les accès non autorisés.                                                        | Utiliser des middlewares pour protéger les routes sensibles, comme un middleware de vérification de session ou d'authentification avant d'accéder aux routes. |
| **Incohérence dans les noms de route**                       | Les noms de routes pour des actions similaires (par exemple, `login` et `register`) ne sont pas cohérents.                                                                    | Harmoniser les noms des routes. Par exemple, utiliser `/user/login` et `/user/register` pour des actions similaires, afin de respecter une structure uniforme et cohérente dans l'API. |

#### BDD

Mettre en place une gestion de droits d'accès afin que chaque utilisateur est chacun leurs droits. Par exemple que seul les administrateurs on accés à la route /admin. Que seul les utilisateurs connectés on accès à la route /task et accès uniquement à leurs informations. Les solutions peuvent être :

Mettre un champ dans la base de données afin de déterminer si l'utilisateur est administrateur ou non et vérifier dans le code si la valeur est bien à 1. Si il est un 1 on le laisse accès à la page, sinon on le redirige sur une autre page.
Pour les routes en /tasks on vérifie que l'utilisateur est connecté grâce à la présence d'un token JWT. Ce même token permettra à l'utilisateur d'intéragir avec ces données et non celle des autres.

#### Package.json

Mettre à jour les dépendances.

#### Global

Dans certains fichiers, il y a des problèmes au niveau de l'indentation. Cela empêche le bon maintient du code

#### Qualité des tests
Les tests n'existent pas.




 
