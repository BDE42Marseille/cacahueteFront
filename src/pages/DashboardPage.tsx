import React, { useState, useEffect } from "react";
import { IAction } from "../types/models/IAction";
import { IAssignedAction } from "../types/models/IAssignedAction";
import { IUser } from "../types/models/IUser";


const DashboardPage = ({ user }: { user: IUser }) => {
  const [action, setAction] = useState<IAssignedAction | null>(null);
  const [score, setScore] = useState({ total: 0, angelPoints: 0, uncovered: 0, gotUncovered: 0 });
  const [highscore, setHighscore] = useState<any[]>([]);
  const [targetActions, setTargetActions] = useState<IAssignedAction[]>([]);
  
  // Exemple de fetch simulé
  useEffect(() => {
    // fetch initial data ici
    // setAction(...), setScore(...), setHighscore(...), setTargetActions(...)
  }, []);

  const handleRequestAction = (difficulty : any) => {
    console.log(`Fetch pour demander action: ${difficulty}`);
    // ici tu mettra ton fetch
  };

  const handleAbandon = () => {
    if(window.confirm("Voulez-vous vraiment abandonner cette action ?")) {
      console.log("Action abandonnée");
      // fetch pour abandonner
      setAction(null);
    }
  };

  const handleValidateAction = (id : any) => {
    console.log("Valider action", id);
    // fetch validation
  };

  const handleUncover = (id : any) => {
    const name = prompt("Entrez le nom de la personne à démastériser");
    if(name) {
      console.log("Démasquer action", id, "avec", name);
      // fetch pour démastériser
    }
  };

  return (
    <div className="dashboard-page">
      <div className="grid-item item1">
        {action ? (
          <div className="current-action">
            <p>Action à faire : {action.action.name}</p>
            <p>Cible : {action.target.login}</p>
            <button className="btn-primary" onClick={handleAbandon}>Abandonner</button>
          </div>
        ) : (
          <div className="request-action">
            <p>Demander une action :</p>
            <button className="btn-primary" onClick={() => handleRequestAction("Facile")}>Facile</button>
            <button className="btn-primary" onClick={() => handleRequestAction("Difficile")}>Difficile</button>
          </div>
        )}
      </div>

      <div className="grid-item item3">
        <h2>Score total: {score.total}</h2>
        <div className="score-details">
          <p>Points d'ange: {score.angelPoints}</p>
          <p>Démasqué quelqu'un: {score.uncovered}</p>
          <p>Se faire démastériser: {score.gotUncovered}</p>
        </div>
      </div>

      <div className="grid-item item4">
        <h2>Highscore</h2>
        <ol>
          {highscore.map((player, index) => (
            <li key={index}>{player.name} - {player.points} pts</li>
          ))}
        </ol>
      </div>

      <div className="grid-item item5">
        <h2>Actions reçues</h2>
        {targetActions.length === 0 ? <p>Aucune action reçue</p> : (
          targetActions.map((act) => (
            <div key={act.action._id} className="target-action">
              <p>{act.action.name}</p>
              {!act.status && <button className="btn-primary" onClick={() => handleValidateAction(act.action._id)}>Valider</button>}
              {act.status && <button className="btn-secondary" onClick={() => handleUncover(act.action._id)}>Démasquer</button>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
