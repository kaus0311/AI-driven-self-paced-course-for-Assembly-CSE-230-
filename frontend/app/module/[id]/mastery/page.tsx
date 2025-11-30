import MasteryClientPage from "./MasteryClientPage";

export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"].map((id) => ({
    id,
  }));
}

export default function MasteryPage() {
  return <MasteryClientPage />;
}
