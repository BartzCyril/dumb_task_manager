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

##### Page d'inscription et de connexion

| **Aspect**                  | **Problème détecté**                                                                                                   | **Suggestions d'amélioration**                                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Design (UI)**             | - Couleur de fond turquoise trop vive, similaire à la page d'accueil.                                                | - Utiliser une couleur plus douce.                                                           |
|                             | - Alignement des champs incorrect : les champs de formulaire sont alignés horizontalement, rendant la lecture difficile.| - Aligner verticalement les champs pour une meilleure lisibilité et organisation.                                        |
|                             | - Bouton "Register!" peu visible et non attractif.                                                                   | - Utiliser un bouton plus grand avec un design clair et attractif.                                                       |
| **Accessibilité**           | - Pas d'indication sur les formats attendus (ex. email, mot de passe, etc.).                                           | - Ajouter des placeholders ou des labels expliquant les formats requis (ex. "Enter a valid email").                      |
|                             | - Absence de contrôle de saisie ou de messages d'erreur en cas de données incorrectes ou incomplètes.                  | - Implémenter une validation des champs et afficher des messages d'erreur clairs et descriptifs.                         |
| **Expérience utilisateur (UX)** | - Pas d'informations sur l’objectif de l'inscription ou sur ce qui se passe après.                                      | - Ajouter une explication claire du processus d'inscription et des étapes suivantes.                                     |
|                             | - L'utilisateur peut saisir des données invalides ou incomplètes sans avertissement.                                  | - Vérifier les champs avant soumission (ex. email valide, mot de passe suffisamment long).                                |
|                             | - La connexion au serveur échoue, entraînant une erreur générique.                                       | - Vérifier si le serveur est en cours d'exécution et si les ports sont configurés correctement (par défaut `localhost:3000`). |
|                             | - Le formulaire d'inscription utilise la méthode GET, exposant les données sensibles dans l'URL.                      | - Utiliser la méthode POST pour transmettre les données de manière sécurisée.                                            |
| **Fonctionnalité**          | - Pas de contrôle sur les champs de saisie, aucune validation des données (ex. email non valide accepté).              | - Ajouter une validation côté client (JS) et côté serveur pour empêcher l'envoi de données incorrectes.                  |
|                             | - La connexion échoue car le serveur semble inaccessible, mal configuré ou une erreur sur les champs envoyés par le formulaire.                                            | - Assurer que le serveur est démarré correctement, que les routes sont configurées, que les dépendances sont installées et que les données sont correctement utilisées.|
|                             | - Aucun retour en cas de succès ou d'échec sur la page d'inscription.                                                 | - Afficher un message de confirmation pour une inscription réussie ou des erreurs si elle échoue.                        |                     |

### 1.2 - Tentatives d'attaque de l'app Individuel

| **Méthode d'Attaque**       | **Description**                                                                                                                                              | **Résultat**                                                                                              | **Solution Proposée**                                                                                                                                                                                                                                                                                       |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **BAC (Bypass Access Control)** | Accès à la page admin sans authentification.                                                                                                              | Possible : La page est accessible directement sans vérification.                                         | Ajouter un middleware d'authentification                                           |
|                             |                                                                                                                                                              |                                                                                                          | Implémenter un contrôle des rôles pour l'accès admin                                                                                                                             |
| **Suppression de tâches sans authentification** | Les tâches d’un utilisateur peuvent être modifiées ou supprimées sans authentification.                                                             | Possible : Les requêtes ne vérifient pas si l'utilisateur est connecté et autorisé.                      | Ajouter une vérification d'autorisation                             |
| **CSRF (Cross-Site Request Forgery)** | Requête envoyée via un formulaire externe pour supprimer une tâche sans l’autorisation de l’utilisateur.                                               | Possible : Test réussi avec le formulaire suivant :<br><br>```html<br><!DOCTYPE html><br><html lang="fr"><br><head><br>    <meta charset="UTF-8"><br>    <title>Test CSRF</title><br></head><br><body><br>    <form action="http://localhost:3000/tasks/remove" method="GET"><br>        <input type="hidden" name="taskId" value="1"><br>        <input type="hidden" name="userId" value="1"><br>        <button type="submit">Envoyer</button><br>    </form><br></body><br></html><br>``` | Configurer les cookies avec `SameSite=Lax` ou `SameSite=Strict` Ajouter un token CSRF |
| **XSS (Cross-Site Scripting)** | Injection de code JavaScript malveillant dans les entrées utilisateur pour exécuter des scripts sur d'autres utilisateurs.                                  | Aucun vecteur exploitable trouvé : Les entrées semblent protégées contre les injections.                 |                                                                                   |
| **Injection SQL**           | Test avec `sqlmap` pour vérifier les vulnérabilités sur les paramètres dans les requêtes SQL.                                                                | Aucun vecteur exploitable trouvé : Les requêtes semblent sécurisées.                                     |                                                                                              |







 
