import { useParams } from 'react-router-dom';
import { useLocale } from '../utils/LocaleContext';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLocale();

  return (
    <main className="page page-property-details">
      <h1>{t.page_property_details_title}</h1>
      <p>ID: {id}</p>
    </main>
  );
}
