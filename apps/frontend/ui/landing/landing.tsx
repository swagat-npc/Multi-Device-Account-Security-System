"use client"

import styles from "@/ui/pages/landing.module.css";
import { useState } from "react";

export default function Landing() {
    const [response, setResponse] = useState("");

    var callEndpoint = (endpoint: string, method: string) => async () => {
        const res = await fetch(`http://localhost:3001${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3001",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
        const data = await res.json();
        setResponse(data);
    };


  return (
    <div className="flex flex-col gap-4 text-base font-medium p-8">
      <div className={styles["route-container"]}>
        <div className="w-full text-sm font p-2 mb-4 bg-white h-50">
            <div className="response text-black">
                {response ? JSON.stringify(response, null, 2) : "Response will appear here"}
            </div>
        </div>
        
        <div className={styles.route}>
          <div className={styles.title}>Testing</div>
          <div className={styles["endpoint-container"]}>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/</div>
              <div className={styles.connect} onClick={callEndpoint("/", "GET")}>Call</div>
            </div>
          </div>
        </div>

        <div className={styles.route}>
          <div className={styles.title}>Auth</div>
          <div className={styles["endpoint-container"]}>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/auth/register</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/register", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/auth/login</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/login", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/auth/refresh</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/refresh", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/auth/logout</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/logout", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/auth/logout-all</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/logout-all", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/auth/sessions</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/sessions", "GET")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>DELETE</div>
              <div className={styles.url}>/auth/sessions/:id</div>
              <div className={styles.connect} onClick={callEndpoint("/auth/sessions/:id", "DELETE")}>Call</div>
            </div>
          </div>
        </div>

        <div className={styles.route}>
          <div className={styles.title}>Notes</div>
          <div className={styles["endpoint-container"]}>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/notes</div>
              <div className={styles.connect} onClick={callEndpoint("/notes", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/notes</div>
              <div className={styles.connect} onClick={callEndpoint("/notes", "GET")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/notes/:id</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id", "GET")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>PATCH</div>
              <div className={styles.url}>/notes/:id</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id", "PATCH")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>DELETE</div>
              <div className={styles.url}>/notes/:id</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id", "DELETE")}>Call</div>
            </div>
          </div>
        </div>

        <div className={styles.route}>
          <div className={styles.title}>User</div>
          <div className={styles["endpoint-container"]}>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/users/me</div>
              <div className={styles.connect} onClick={callEndpoint("/users/me", "GET")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>PATCH</div>
              <div className={styles.url}>/users/me</div>
              <div className={styles.connect} onClick={callEndpoint("/users/me", "PATCH")}>Call</div>
            </div>
          </div>
        </div>

        <div className={styles.route}>
          <div className={styles.title}>ACCESS</div>
          <div className={styles["endpoint-container"]}>
            <div className={styles.endpoint}>
              <div className={styles.method}>POST</div>
              <div className={styles.url}>/notes/:id/share</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id/share", "POST")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>DELETE</div>
              <div className={styles.url}>/notes/:id/share/:userId</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id/share/:user", "DELETE")}>Call</div>
            </div>
            <div className={styles.endpoint}>
              <div className={styles.method}>GET</div>
              <div className={styles.url}>/notes/:id/access</div>
              <div className={styles.connect} onClick={callEndpoint("/notes/:id/access", "GET")}>Call</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
