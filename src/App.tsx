import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ProfileList from "./components/ProfileList";
import SearchForm from "./components/SearchForm";
import Axios from 'axios';

export type Profile = {
  id: number;
  login: string;
  name: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  html_url: string;
  repos_url: string;
  repos: Repo[];
};

export type Repo = {
  id: number;
  name: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
};

function App() {

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    getStoredProfiles();
  }, []);

  function getStoredProfiles(): void {
    const storedProfiles = localStorage.getItem("githubpagesdata");
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    }
  }

  function searchProfile(value: string): void {
    const usernames = profiles.map((profile) => profile.login);
    const isUsernameExists = usernames.includes(value);
    if (isUsernameExists) return;

    getProfileWithRepos(value)
      .then((profile) => {
        setProfiles([profile, ...profiles]);
        localStorage.setItem(
          "githubpagesdata",
          JSON.stringify([profile, ...profiles])
        );
      })
      .catch((err) => {
        console.error(err);
        setShowError(true);
      });
  }

  function clearProfiles(): void {
    setProfiles([]);
    localStorage.removeItem("githubpagesdata");
  }

  function dismissError(): void {
    setShowError(false);
  }

  async function getProfileWithRepos(username: string): Promise<Profile> {
    const { data: profile } = await Axios.get(`https://api.github.com/users/${username}`);
    const { data: repos } = await Axios.get(profile.repos_url);

    return { ...profile, repos } as Profile;
  }

  return (
    <div className="App">
      <Header title="Github Profiles" />

      <SearchForm onSearch={searchProfile} onClear={clearProfiles} />

      <ProfileList
        profiles={profiles}
        showError={showError}
        onDismissError={dismissError}
      />

    </div>
  );
}

export default App;
