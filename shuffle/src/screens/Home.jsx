import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import HeroArt from "../components/HeroArt.jsx";
import SafetyNote from "../components/SafetyNote.jsx";
import Icon from "../components/Icon.jsx";

export default function Home({ onSurprise, onPreferences }) {
  const scrollToHow = () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app">
      <Header onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <button className="btn btn-sm hide-sm" onClick={scrollToHow}>How it works</button>
        <button className="btn btn-sm btn-pink" onClick={onPreferences}>Get started</button>
      </Header>

      <main className="page">
        <section className="hero grid-bg">
          <div className="container hero-grid">
            <div>
              <span className="tag hero-badge"><span className="dot" /> Instant workout generator</span>
              <h1 className="display h1" style={{ marginBottom: 22 }}>
                <span className="stamp">Bored of</span>
                <span className="block" style={{ marginTop: 10 }}>your usual</span>
                <span className="block pinkword">workout?</span>
              </h1>
              <p className="lead" style={{ marginBottom: 24 }}>
                Pick a mood, choose what you want to move, and hit shuffle. Get a fresh workout you can follow right here.
              </p>
              <div className="row" style={{ marginBottom: 14 }}>
                <button className="btn btn-blue btn-big" onClick={onSurprise}>
                  <Icon name="shuffle" size={26} /> Shuffle <Icon name="arrow" size={22} />
                </button>
                <button className="btn" onClick={onPreferences}>
                  <Icon name="tune" size={20} /> Choose preferences
                </button>
              </div>
              <p style={{ fontWeight: 700, fontSize: 14 }}>Start with a surprise workout or customise it first.</p>
            </div>
            <div className="hero-art wiggle">
              <span className="sticker a">★ 100% unexpected</span>
              <span className="sticker b">No two alike</span>
              <HeroArt />
            </div>
          </div>
        </section>

        <section className="how section" id="how-it-works">
          <div className="container">
            <span className="tag tag-yellow">The method</span>
            <h2 className="display h2" style={{ margin: "10px 0 24px" }}>How it works</h2>
            <div className="steps">
              <div className="card card-yellow">
                <div className="step-num">01</div>
                <h3 className="display h3" style={{ margin: "8px 0" }}>Pick feeling &amp; focus</h3>
                <p>Match your workout to your mood, your goal and the equipment you have.</p>
              </div>
              <div className="card">
                <div className="step-num" style={{ color: "var(--blue)" }}>02</div>
                <h3 className="display h3" style={{ margin: "8px 0" }}>Choose your time</h3>
                <p>From a quick 5 minute boost to a full hour. Fit it to your day, not the other way round.</p>
              </div>
              <div className="card card-pink">
                <div className="step-num">03</div>
                <h3 className="display h3" style={{ margin: "8px 0" }}>Hit shuffle &amp; follow</h3>
                <p>Get a workout from our hand-picked library and follow it with a built-in timer.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container"><SafetyNote /></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
