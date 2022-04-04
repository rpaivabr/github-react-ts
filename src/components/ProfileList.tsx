import { Profile } from "../App";
import Alert from "./Alert";
import ProfileCard from "./ProfileCard";

export type ProfileListProps = {
  profiles: Profile[];
  showError: boolean;
  onDismissError: () => void;
};

function ProfileList({
  profiles,
  showError,
  onDismissError,
}: ProfileListProps) {

  return (
    <div className="container d-flex flex-wrap">
      <Alert type="danger" show={showError} onDismiss={onDismissError} />

      {profiles.map((profile: Profile) => (
        <ProfileCard profile={profile} key={profile.id} />
      ))}
    </div>
  );
}

export default ProfileList;
