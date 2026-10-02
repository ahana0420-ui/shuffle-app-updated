import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Icon from "../components/Icon.jsx";

export default function Complete({ result, completed, onShuffleAgain, onPreferences, onHome }) {
  const { workout, session, minutes } = result;
  return (
    <div className="app">
      <Header onHome={onHome} />
      <main className="page">
        <section className="done-hero" style={{ background: "var(--pink)" }}>
          <span className="star" style={{ top: 24, left: "8%" }} aria-hidden="true">★</span>
          <span className="star" style={{ top: 70, right: "10%", animationDelay: ".6s" }} aria-hidden="true">✦</span>
          <span className="star" style={{ bottom: 20, left: "22%", animationDelay: "1.2s" }} aria-hidden="true">✦</span>
          <div className="container pop-in">
            <span className="tag tag-yellow">Session complete</span>
            <h1 className="display h1" style={{ margin: "16px 0" }}>You did the thing.</h1>
            <p className="lead" style={{ margin: "0 auto", color: "var(--white)" }}>Workout complete. Nice work showing up.</p>
          </div>
        </section>

        <div className="container section stack" style={{ gap: 28 }}>
          <div className="card recap">
            <span className="tag tag-blue">Recap</span>
            <h2 className="display h2" style={{ margin: "12px 0 0" }}>{workout.title}</h2>
            <ul>
              <li><Icon name="check" size={20} /> {completed} of {session.steps.length} exercises completed</li>
              <li><Icon name="clock" size={20} /> {minutes} minutes planned</li>
            </ul>
          </div>

          <div style={{ textAlign: "center" }}>
            <p className="lead" style={{ margin: "0 auto 18px" }}>Want to keep moving? Shuffle another one.</p>
            <div className="row" style={{ justifyContent: "center" }}>
              <button className="btn btn-pink btn-big" onClick={onShuffleAgain}><Icon name="shuffle" size={24} /> Shuffle again</button>
              <button className="btn" onClick={onPreferences}><Icon name="tune" size={20} /> Edit preferences</button>
              <button className="btn btn-yellow" onClick={onHome}><Icon name="home" size={20} /> Back to home</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
