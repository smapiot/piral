import * as React from 'react';
import { Capability } from './Capability';
import friends from '../../codegen/friends.codegen';

export interface FriendsProps {}

export const Friends: React.FC<FriendsProps> = () => (
  <div className="container container-section text-center">
    <h2>Open-Source Friends</h2>
    <p className="larger">Meet our friends who also building and contributing to Open Source.</p>
    <div className="oss-friends-list">
      {friends.map((friend) => (
        <Capability
          title={friend.name}
          cta={
            <a href={friend.href} target="_blank" rel="noopener noreferrer" className="btn atlas-cta cta-blue">
              Learn more
            </a>
          }
        >
          {friend.description}
        </Capability>
      ))}
    </div>
  </div>
);
