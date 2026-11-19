import "../src/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";

document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";

// The <html> shell is only for server rendering; on a static page the root renders straight into #root.
(routeTree.options as { shellComponent?: unknown }).shellComponent = undefined;

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: { queryClient: new QueryClient() },
  scrollRestoration: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
