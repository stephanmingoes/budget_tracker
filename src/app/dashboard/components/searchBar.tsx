import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  query,
  setQuery,
  setQuery2,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setQuery2: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        onClick={() => {
          setQuery2(query);
        }}
      >
        Search
      </Button>
    </div>
  );
}
