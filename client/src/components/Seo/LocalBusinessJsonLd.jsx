import { localBusinessSchema } from '../../config/businessProfile';

const serializedBusinessSchema = JSON.stringify(localBusinessSchema);

function LocalBusinessJsonLd() {
  return (
    <script type="application/ld+json">
      {serializedBusinessSchema}
    </script>
  );
}

export default LocalBusinessJsonLd;
