import CharacterSplashPage from "../components/CharacterSplashPage.jsx";

const TIPS = ["Wow you clicked, Hello."];

export default function LivvyPage() {
  return (
    <CharacterSplashPage
      bgPath="/images/Pukao_wh.webp"
      title="Zoe"
      akaTitle="Livvy"
      tips={TIPS}
    />
  );
}
