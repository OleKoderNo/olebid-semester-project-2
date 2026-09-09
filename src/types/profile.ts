/** An image associated with an auction profile. */
export interface ProfileImage {
  url: string;
  alt: string;
}

/** Account information returned by the auction profile endpoint. */
export interface AuctionProfile {
  name: string;
  email: string;
  bio: string | null;
  avatar: ProfileImage | null;
  banner: ProfileImage | null;
  credits: number;
  _count: {
    listings: number;
    wins: number;
  };
}

/** Response containing one auction profile. */
export interface ProfileResponse {
  data: AuctionProfile;
}
