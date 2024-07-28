import { api, cl, uploads } from "../lib/servers";
import { Button } from "./Button";
import { getCloudlink } from "../lib/api/cloudlink";
import { Mention } from "./Mention";
import { ChangeServers } from "./ChangeServers";

export const About = () => {
  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="text-2xl font-bold">Roarer</p>
      <p>
        Roarer is a simple and mobile friendly client for{" "}
        <a href="https://meower.org/" className="font-bold text-lime-600">
          Meower
        </a>{" "}
        made by <Mention username="mybearworld" />.
      </p>
      <p>
        You're using Roarer 2, which is a new version of Roarer that's currently
        in development. It may be unstable. Please let me know what you think!
        You can access the original version of Roarer{" "}
        <a
          href="https://mybearworld.github.io/roarer/#/home"
          target="_blank"
          className="font-bold text-lime-600"
        >
          here
        </a>
        .
      </p>
      <div>
        You are using the following servers:
        <ul className="list-inside list-disc">
          <li>
            API:{" "}
            <a className="font-bold text-lime-600" href={api}>
              {api}
            </a>
          </li>
          <li>
            Cloudlink:{" "}
            <a className="font-bold text-lime-600" href={cl}>
              {cl}
            </a>
          </li>
          <li>
            Uploads:{" "}
            <a className="font-bold text-lime-600" href={uploads}>
              {uploads}
            </a>
          </li>
        </ul>
      </div>
      <div className="flex justify-center text-lg">
        <a
          href="https://github.com/mybearworld/roarer-2"
          target="_blank"
          className="font-bold text-lime-600"
        >
          GitHub
        </a>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() =>
            getCloudlink().then((cloudlink) => cloudlink.disconnect())
          }
        >
          Disconnect
        </Button>
        <ChangeServers>
          <Button>Change servers</Button>
        </ChangeServers>
      </div>
    </div>
  );
};
