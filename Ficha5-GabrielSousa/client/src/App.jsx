import { useEffect, useState } from "react";
import Card from "./Card.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");

  // Buscar cartas ao servidor e filtrar por tipo
  useEffect(() => {
    setLoading(true);
    setError("");

    const url =
      filter === "Todas"
        ? "http://localhost:3000/api/cartas"
        : `http://localhost:3000/api/cartas?tipo=${encodeURIComponent(filter)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter]);

 async function handleSubmit(e) {
  e.preventDefault();

  const newCard = {
    name,
    type,
    attack: Number(attack),
  };

  try {
    const response = await fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCard),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const card = await response.json();

    setCards([...cards, card]);

    setName("");
    setType("Criatura");
    setAttack("");

  } catch (err) {
    setError(err.message);
  }
}

  // EXTRA 1 - Escolher carta aleatória através da API
  function pickRandom() {
    fetch("http://localhost:3000/api/cartas/aleatoria")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setRandomCard(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  // Estado de carregamento
  if (loading) {
    return <h2>A carregar...</h2>;
  }

  // Estado de erro
  if (error) {
    return <h2>Erro ao carregar cartas: {error}</h2>;
  }

  return (
    <main>
      <h1>A minha coleção</h1>
      <h2>Adicionar nova carta</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placehnolder="Nome da carta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Criatura">Criatura</option>
          <option value="Feitiço">Feitiço</option>
        </select>

        <input
          type="number"
          placeholder="Ataque"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
        />

        <button type="submit">Adicionar carta</button>
      </form>
      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <div>
        <button onClick={() => setFilter("Todas")}>
          Todas
        </button>

        <button onClick={() => setFilter("Criatura")}>
          Só criaturas
        </button>

        <button onClick={() => setFilter("Feitiço")}>
          Só feitiços
        </button>

        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome..."
      />

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>

      <button onClick={pickRandom}>
        Escolher outra
      </button>

      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque{" "}
          {randomCard.attack} · defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}

export default App;