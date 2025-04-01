export type UserTypes = {
  connectionId: string;
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: any[];
  $updatedAt: string;
  accountId: string;
  avatar: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  followers: number;
  following: number;
  looks: number;
  bio: string;
  isFollowing: boolean;
};

// TargetTypes definition remains unchanged
export type TargetTypes = {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  identifier: string;
  name: string;
  providerId: null | string;
  providerType: string;
  userId: string;
};

// AccountTypes updated to accept an array of TargetTypes
export type AccountTypes = {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  email: string;
  emailVerification: boolean;
  labels: string[];
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: object;
  registration: string;
  status: boolean;
  targets: TargetTypes; // Changed to an array
  User: {
    $collectionId: string;
    $databaseId: string;
    $permissions: any[];
    accountId: string;
  };
};
export interface LooksProps {
  documents: PostTypes[];
}

export type DbUserType = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: [string, string, string];
  $updatedAt: string;
  accountId: string;
  avatar: string;
  bio: string;
  email: string;
  followers: number;
  looks: number;
  name: string;
  phone: string;
  role: string;
};

export type PostTypes = {
  title: string;
  description: string;
  category: string;
  gallery: string[];
  product_links: string[];
  likes: number;
  saves: number;
  isDraft?: boolean;
  isLiked: boolean;
  isSaved: boolean;
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  likeId: string;
  saveId: string;
  likeIam: string;
  $permissions: [string, string, string];
  user: UserTypes;
};

export type RootUserDbType = {
  documents: [
    {
      $collectionId: string;
      $createdAt: string;
      $databaseId: string;
      $id: string;
      $permissions: [string, string, string];
      $updatedAt: string;
      accountId: string;
      avatar: string;
      bio: string;
      email: string;
      followers: number;
      looks: number;
      name: string;
      phone: string;
      role: string;
    }
  ];
};

export interface AccountResult {
  session: AccountTypes;
  db: RootUserDbType;
}

export interface SavePostTypes {
  documentsId?: string;
  userId?: string;
  isTrue?: boolean;
  deleteDocId?: string;
  likes?: number;
  saves?: number;
  follower?: string;
  following?: string;
}
export interface SavePostReturnTypes {
  user: string;
  post: string;
}

export type followTypes = {
  follower: string;
  following: string;
  follower_num?: number;
  following_num?: number;
  isFollowing?: boolean;
  connectionId?: string;
};

export type GoogleSignup = {
  name: string;
  email: string;
  avatar: string;
  auth_type: string;
};
