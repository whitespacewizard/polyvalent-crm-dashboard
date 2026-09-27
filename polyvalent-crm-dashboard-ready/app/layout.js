import "./globals.css";

export const metadata = {
  title: "Polyvalent X Branviz CRM",
  description: "CRM dashboard"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
