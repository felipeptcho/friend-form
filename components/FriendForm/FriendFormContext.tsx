import { createContext, useContext } from 'react';
import { FriendFormContextType } from './types';

export const FriendFormContext: React.Context<FriendFormContextType> = createContext(
  undefined as any, // eslint-disable-line @typescript-eslint/no-explicit-any
);

export const useFriendFormContext = (): FriendFormContextType => useContext(FriendFormContext);
