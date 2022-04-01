import { FormEvent, useEffect, useState } from "react";
import "./App.css";

type Profile = {
  id: number;
  login: string;
  name: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  html_url: string;
  repos_url: string;
  repos: Repo[];
}

type Repo = {
  id: number;
  name: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
}

type SortHandler = {
  [key: string]: (a: Repo, b: Repo) => number;
}

function App() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    getStoredProfiles();
  }, [])

  function getStoredProfiles(): void {
    const storedProfiles = localStorage.getItem('githubpagesdata')
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    }
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
  }

  function searchProfile(): void {
    if (!searchInput) return;
    
    const usernames = profiles.map(profile => profile.login);
    const isUsernameExists = usernames.includes(searchInput)

    if (isUsernameExists) return;

    getProfileWithRepos(searchInput)
      .then(profile => {
        setProfiles([profile, ...profiles])
        console.log('após set profile', profiles)
        localStorage.setItem('githubpagesdata', JSON.stringify([profile, ...profiles]));
      })
      .catch(err => {
        console.error(err);
        setShowError(true);
      })
  }

  function clearProfiles(): void {
    setProfiles([]);
    localStorage.removeItem('githubpagesdata')
  }

  function dismissError(): void {
    setShowError(false);
  }

  function sortRepos(event: any, index: number, type: string): void {
    event.preventDefault();

    const sortHandler: SortHandler = {
      'name_asc': (a: Repo, b: Repo) => {
        return a.name.localeCompare(b.name);
      },
      'updated_desc': (a: Repo, b: Repo) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    }

    const updatedProfiles = profiles.map((profile, i) => {
      if (index === i) {
        profile.repos = profile.repos.sort(sortHandler[type]);
      }

      return profile
    })

    setProfiles(updatedProfiles);
  }


  async function getProfileWithRepos(username: string): Promise<Profile> {
    const profileResponse = await fetch(`https://api.github.com/users/${username}`)
    const profile: Profile = await profileResponse.json();

    const reposResponse = await fetch(profile.repos_url);
    const repos: Repo[] = await reposResponse.json()

    profile.repos = repos;

    return profile;
  }

  return <div className="App">
    <nav className="navbar navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand mb-0 h1">Github Profiles</span>
      </div>
    </nav>

    <form className="container py-4" onSubmit={handleSubmit}>
      <label htmlFor="basic-url" className="form-label">
        Please fill some valid username:
      </label>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon3">
          https://github.com/
        </span>
        <input
          type="text"
          className="form-control"
          id="basic-url"
          onChange={e => setSearchInput(e.target.value)}
          aria-describedby="basic-addon3"
          onKeyUp={e => e.key === 'Enter' && searchProfile()}
        />
        <button
          className="btn btn-outline-success"
          type="button"
          id="button-addon2"
          onClick={searchProfile}
        >
          Search
        </button>
        <button
          className="btn btn-outline-warning"
          type="button"
          id="button-addon2"
          onClick={clearProfiles}
        >
          Clear
        </button>
      </div>
    </form>

    <div className="container d-flex flex-wrap">
      { showError && (
        <div className="alert alert-danger alert-dismissible container" role="alert">
          Usuário inválido ou inexistente!
          <button type="button" className="btn-close" aria-label="Close" onClick={dismissError}></button>
        </div>
      )}

      {
        profiles.map((profile: Profile, index) => (
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
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div className="col-8 col-md-9 col-lg-10">
                <div className="card-body">
                  <h5 className="card-title">{ profile.name }</h5>
                  <p className="card-text">
                    <a href={profile.html_url}>/{ profile.login }</a>
                  </p>
                  <p className="card-text">
                    <small className="text-muted"
                      >Followers: <strong>{ profile.followers }</strong> |
                    </small>
                    <small className="text-muted"
                      >Public repos: <strong>{ profile.public_repos }</strong></small
                    >
                  </p>
                  <p>
                    { profile.repos.slice(0, 4).map(repo => (
                        <span className="badge bg-primary mx-1" key={repo.id}>
                          <a href={repo.html_url} className="text-light">{ repo.name }</a>
                        </span>
                    )) }
                    <br />
                    <small className="text-muted mx-1">
                      <a href="#" onClick={e => sortRepos(e, index, 'updated_desc')}>Last updated</a> |
                      <a href="#" onClick={e => sortRepos(e, index, 'name_asc')}>Alphabetic</a>
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>

        ))
      }

    </div>
  </div>;
}

export default App;
