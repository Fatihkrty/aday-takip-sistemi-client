'use client';

import AutocompleteTable from '../sections/autocomplete-table';

export default function SectorsPage() {
  return <AutocompleteTable queryKey={['SECTOR_QUERY_KEY']} url="sector" />;
}
