import './globals.css';

export const metadata = {
  title: 'EMPREZA 2026 | University Sports Championship',
  description: 'Official Real-Time Scoreboard, Teams & Event Portal for EMPREZA 2026',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0C0C0C] text-white antialiased selection:bg-[#E7B736] selection:text-[#0C0C0C]">
        {children}
      </body>
    </html>
  );
}
