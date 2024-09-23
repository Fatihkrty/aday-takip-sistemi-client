'use client';

import AutocompleteTable from '../sections/autocomplete-table';

export default function LoactionsPage() {
  return <AutocompleteTable queryKey={['LOCATION_QUERY_KEY']} url="location" />;
}
