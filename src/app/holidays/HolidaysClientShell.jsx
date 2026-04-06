import HolidaysClientInteractive from './HolidaysClientInteractive';
import { getHolidaysClientModel } from './holidays-client-model';

export default function HolidaysClientShell(props) {
  const model = getHolidaysClientModel();

  return <HolidaysClientInteractive {...props} {...model} />;
}
