import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccountProvider } from "./components/AccountContext";
import { ListingsProvider } from "./components/ListingsContext";

export default function App() {
  return (
    <AccountProvider>
      <ListingsProvider>
        <RouterProvider router={router} />
      </ListingsProvider>
    </AccountProvider>
  );
}