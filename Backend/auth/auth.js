const bcrypt = require('bcrypt');

// Fonction appelée à l'inscription
async function signup(password) 
{
  const hash = await bcrypt.hash(password, 10); // "hasher" le mdp, le "salt" pour rendre le hash unique si deux utilisateurs ont le même mdp
  console.log('Mot de passe haché :', hash);
  return hash; // a stocker dans colonne password de la table User
}

// Fonction appelée à la connexion
async function login(password, DbHashPass) 
{
  const isValid = await bcrypt.compare(password, DbHashPass);//comparer le mdp tapé au hash stocké 
  console.log(isValid ? 'Connexion réussie !' : 'Mot de passe incorrect.');
  return isValid;
}
