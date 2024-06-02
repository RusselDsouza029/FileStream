import { AppUseContext } from "../context/AppContext";
import { Auth } from "@supabase/auth-ui-react";

const AppAuth = () => {
  const { supabase } = AppUseContext();
  return (
    <>
      <Auth
        supabaseClient={supabase}
        providers={["google", "github"]}
        onlyThirdPartyProviders
        appearance={{
          style: {
            button: {
              background: "transparent",
              color: "#fff",
              width: "fit-content",
              padding: "10px",
              margin: "10px",
              border: "2px solid",
            },
            anchor: { color: "blue" },
          },
        }}
      />
    </>
  );
};

export default AppAuth;
