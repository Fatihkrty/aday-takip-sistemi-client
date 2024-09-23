'use client';

import AutocompleteTable from '../sections/autocomplete-table';

export default function PositionsPage() {
  return <AutocompleteTable queryKey={['POSITION_QUERY_KEY']} url="position" />;
}
