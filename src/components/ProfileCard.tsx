import { useState } from "react";
import { Profile, Repo } from "../App";

export type ProfileCardProps = {
  profile: Profile;
};

type SortHandler = {
  [key: string]: (a: Repo, b: Repo) => number;
};

function ProfileCard({ profile }: ProfileCardProps) {
  const [repos, setRepos] = useState<Repo[]>(profile.repos);

  function sortRepos(event: any, type: string): void {
    event.preventDefault();

    const sortHandler: SortHandler = {
      name_asc: (a: Repo, b: Repo) => {
        return a.name.localeCompare(b.name);
      },
      updated_desc: (a: Repo, b: Repo) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      },
    };

    setRepos([...repos.sort(sortHandler[type])]);
  }

  return (
    <div className="card mb-3 w-100" key={profile.id}>
      <div className="row">
        <div className="col-4 col-md-3 col-lg-2">
          <img
            src={profile.avatar_url}
            className="img-fluid rounded-start"
            alt="Profile avatar photo"
            style={{
              height: 200,
              margin: 10,
              objectFit: "cover",
            }}
          />
        </div>
        <div className="col-8 col-md-9 col-lg-10">
          <div className="card-body">
            <h5 className="card-title">{profile.name}</h5>
            <p className="card-text">
              <a href={profile.html_url}>/{profile.login}</a>
            </p>
            <p className="card-text">
              <small className="text-muted">
                Followers: <strong>{profile.followers}</strong>{' | '}
              </small>
              <small className="text-muted">
                Public repos: <strong>{profile.public_repos}</strong>
              </small>
            </p>
            <p>
              {repos.slice(0, 4).map((repo) => (
                <span className="badge bg-primary mx-1" key={repo.id}>
                  <a href={repo.html_url} className="text-light">
                    {repo.name}
                  </a>
                </span>
              ))}
              <br />
              <small className="text-muted mx-1">
                <a
                  href="#"
                  onClick={(e) => sortRepos(e, "updated_desc")}
                >
                  Last updated
                </a>{" | "}
                <a href="#" onClick={(e) => sortRepos(e, "name_asc")}>
                  Alphabetic
                </a>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
