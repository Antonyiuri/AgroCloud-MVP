import React from 'react';
import './SuccessStories.css';

function SuccessStories() {
  const stories = [
    {
      title: "Irrigação Inteligente em Soja",
      image: "https://source.unsplash.com/800x400/?soy,agriculture",
      description: "Produtores aumentaram em 23% sua produtividade com sensores de solo e dados climáticos integrados.",
    },
    {
      title: "Tecnologia no Cultivo de Milho",
      image: "https://source.unsplash.com/800x400/?corn,farm,drone",
      description: "Uso de drones e algoritmos ajudou a reduzir o desperdício de água em plantações de milho.",
    },
    {
      title: "Agricultura Sustentável",
      image: "https://source.unsplash.com/800x400/?sustainable,farming",
      description: "Fazendas familiares implementaram práticas sustentáveis e viram crescimento econômico e ecológico.",
    },
  ];

  return (
    <div className="success-stories">
      <h2>🌾 Cases de Sucesso</h2>
      <div className="stories-grid">
        {stories.map((story, index) => (
          <div className="story-card" key={index}>
            <img src={story.image} alt={story.title} />
            <h3>{story.title}</h3>
            <p>{story.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuccessStories;
