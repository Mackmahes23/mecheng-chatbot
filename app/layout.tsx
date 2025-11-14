export const metadata = {
  title: "Mechanical Engineering Chatbot",
  description: "MechEng Assistant built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
