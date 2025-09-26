import fs from 'fs/promises';
import path from 'path';
import SvgViewer from '../components/SvgViewer';

export default async function Home() {
  const iconsDirectory = path.join(process.cwd(), 'public', 'icons');
  const filenames = await fs.readdir(iconsDirectory);
  const svgPaths = filenames.filter(name => name.endsWith('.svg')).map(name => `/icons/${name}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SvgViewer svgPaths={svgPaths} />
    </main>
  );
}
