import React, { useState, useEffect, JSX } from 'react';
import { IAssignedAction } from '../types/models/IAssignedAction';
import { IUser } from '../types/models/IUser';

export default function DashboardPage({user, token}: {user: IUser, token: string}) {
  const [currentAction, setCurrentAction] = useState<IAssignedAction | null>(null);
  const [scores] = useState({ total: user.score.totalScore, good: user.score.goodPoint, reveal: user.score.revealPoint, revealed: user.score.revealedPoint });
  const [highscores, setHighscores] = useState<IUser[]>([]);
  const [targetActions, setTargetActions] = useState<IAssignedAction[]>([]);
  const [showDemasqueForm, setShowDemasqueForm] = useState(false);
  const [demasqueTarget, setDemasqueTarget] = useState('');
  const [message, setMessage] = useState('');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  
    useEffect(() => {
      fetchData();
    // eslint-disable-next-line
    }, []);

  const fetchData = async (): Promise<void> => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          console.log(data);
          if (data.actions.current) {
            setCurrentAction(data.actions.current);
          }
          setTargetActions([...data.actions.toCheck, ...data.actions.validate]);
          console.log(data.actions.toCheck);
          console.log(data.actions.validate); 
        }
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des actions ciblées:", err);
      });
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/top`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          setHighscores(data.users);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la récupération du top des utilisateurs:", err);
      });
  };

  const handleAskAction = async (difficulty: 0 | 1): Promise<void> => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          setCurrentAction(data.action);
        } else {
          setMessage(data.error || "Erreur lors de la demande d'une action.");
        }
      })
      .catch(err => {
        console.error("Erreur lors de la demande d'une action:", err);
      });
  };

  const handleAbandonAction = async (): Promise<void> => {
    if (window.confirm("Voulez-vous vraiment abandonner cette action ?")) {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation/abandon/${currentAction?._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.succes) {
            setMessage("Action abandonnée avec succès.");
            setCurrentAction(null);
          }
        })
        .catch(err => {
          console.error("Erreur lors de l'abandon de l'action:", err);
        });
    }
  };

  const handleValidateCurrentAction = async (): Promise<void> => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation/validate-angel/${currentAction?._id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          setMessage(data.message);
          setCurrentAction(null);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la validation de l'action:", err);
      });
  };

  const handleValidateAction = async (actionId: string,): Promise<void> => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation/validate-target/${actionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          setMessage("Action validée avec succès.");
          fetchData();
          // Met à jour la liste des actions ciblées en changant le statut de l'action validée
          const updatedActions = targetActions.map(action => {
            if (action._id === actionId) {
              return { ...action, status: 2 }; // 2 pour validé
            }
            return action;
          });
          setTargetActions(updatedActions);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la validation de l'action:", err);
      });
  };

  // const handleDemasque = (actionId: string): void => {
  //   setSelectedActionId(actionId);
  //   setShowDemasqueForm(true);
  // };

  const handleSubmitDemasque = async (): Promise<void> => {
    if (!selectedActionId || !demasqueTarget) {
      setMessage("Veuillez sélectionner une action et entrer un nom d'utilisateur.");
      return;
    }

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assignation/demask/${selectedActionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ demask: demasqueTarget }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.succes) {
          setMessage(data.message);
          setShowDemasqueForm(false);
          setDemasqueTarget('');
          setSelectedActionId(null);
          fetchData();
        } else {
          setMessage(data.error || "Erreur lors du démasquage.");
        }
      })
      .catch(err => {
        console.error("Erreur lors du démasquage:", err);
        setMessage("Erreur lors du démasquage.");
      });
  };

  const whichButton = (status: number, action: IAssignedAction): JSX.Element => {
      if (status === 1)
        return <button onClick={() => handleValidateAction(action._id)}>Valider</button>;
      else
        return (<></>);
    }

  const messageOrListActionsTarget = (): JSX.Element => {
    if (targetActions.length === 0) {
      return <p>Aucune action où vous étiez la cible n'a été terminée ou a demasquer.</p>;
    } else {
      return (
        <ul>
          {targetActions.map((action) => (
            <li key={action._id}>
              <div>
                <h4>
                {action.action.description}
                </h4>
                <p>Par : {action.angel.login}</p>
              </div>
              {whichButton(action.status, action)}
            </li>
          ))}
        </ul>
      );
    }
  };




  return (
    <div className="parent">
      {/* Section 1: Actions (div1) */}
      <div className="div1 section actions">
        {currentAction ? (
          <div className="current-action">
            <h3>Action en cours</h3>
            <h4>{currentAction.action.description}</h4>
            <p>Cible : {currentAction.target.login}</p>
            <button className="abandon-button" onClick={handleValidateCurrentAction}>Terminer</button>
            <button className="abandon-button" onClick={handleAbandonAction}>Abandonner</button>
          </div>
        ) : (
          <div className="ask-action">
            <h3>Demander une action</h3>
            <div className="action-buttons">
              <button className="easy-button" onClick={() => handleAskAction(0)}>Facile</button>
              <button className="hard-button" onClick={() => handleAskAction(1)}>Difficile</button>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Score (div2) */}
      <div className="div2 section score">
        <h3>Score</h3>
        <div className="total-score">{scores.total}</div>
        <div className="sub-scores">
          <div>Points d'ange : {scores.good}</div>
          <div>Point de coopération : {scores.reveal}</div>
        </div>
      </div>

      {/* Section 3: Historique des actions (div3) */}
      <div className="div3 section target-actions">
        <h3>Actions où vous étiez la cible</h3>
          {messageOrListActionsTarget()}
      </div>

      {/* Section 4: Highscore (div4) */}
      <div className="div4 section highscore">
        <h3>Highscore</h3>
        <ul>
          {highscores.map((player, index) => (
            <li key={index}>{player.login} : {player.score.totalScore}</li>
          ))}
        </ul>
      </div>

      {/* Formulaire de démasquage */}
      {showDemasqueForm && (
      <>
        <div
          className="form-overlay visible"
          onClick={() => setShowDemasqueForm(false)}
        />
        <div className="demasque-form">
          <div className="form-header">
            <h3>Démasquer un joueur</h3>
            <button
              className="close-button"
              onClick={() => setShowDemasqueForm(false)}
            >
              &times;
            </button>
          </div>
          <div className="form-description">
            Entrez le nom du joueur que vous pensez être votre cible.
          </div>
          <input
            type="text"
            placeholder="Nom du joueur à démasquer"
            value={demasqueTarget}
            onChange={(e) => setDemasqueTarget(e.target.value)}
          />
          <button onClick={handleSubmitDemasque}>Soumettre</button>
        </div>
      </>
    )}

      {/* Message de feedback */}
      {message && (
        <div className="message" onAnimationEnd={() => setMessage('')}>
          {message}
        </div>
      )}
    </div>
  );
}
