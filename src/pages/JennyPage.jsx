import CharacterSplashPage from "../components/CharacterSplashPage.jsx";

const TIPS = ["Nub artist. (complete lies btw.)"];

export default function JennyPage() {
  return (
    <CharacterSplashPage
      bgPath="/images/Trin.webp"
      title="Jenny"
      akaTitle="Jenny the pro god"
      tips={TIPS}
    />
  );
}
