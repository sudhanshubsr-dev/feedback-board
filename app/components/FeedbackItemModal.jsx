import React from 'react';
import Popup from './Popup';
import Button from './Button';
import FeedbackItemPopupComments from './FeedbackItemPopupComments';
import axios from 'axios';
import { useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';
import Attachment from './Attachment';

const FeedbackItemPopup = ({ title, description, openShow, votes, id, onVoteChange, uploads }) => {
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);

  const handleVoteClick = async () => {
    try {
      if (isLoggedin) {
        setIsVotesLoading(true);
        await axios.post('/api/vote', { feedbackId: id });
        await onVoteChange();
        setIsVotesLoading(false);
      } else {
        alert("Please login to vote");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { data: session } = useSession();
  const iVoted = votes?.some((vote) => vote.userEmail === session?.user?.email);

  return (
    <Popup title={''} setShow={openShow}>
      <div className='p-8 pb-2'>
        <h2 className='text-lg font-bold mb-2'>{title}</h2>
        <p className='text-gray-600'>{description}</p>

        {uploads?.length > 0 && (
          <div className='mt-4'>
            <span className='text-gray-600'>Attachments:</span>
            <div className='mt-1 flex gap-2'>
              {uploads.map((link) => (
                <Attachment key={link.index} link={link} showRemoveButton={false} />
              ))}
            </div>
          </div>
        )}

        <div className='flex justify-end px-8 py-2 border-b'>
          {!isVotesLoading && (
            <Button primary="true" onClick={handleVoteClick}>
              {!iVoted && (
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" dataslot="icon" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </span>
              )}
              {iVoted && (
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" dataslot="icon" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13.5 12 21m0 0 7.5-7.5M12 21V3" />
                  </svg>
                </span>
              )}
              {!iVoted && (
                <>
                  Upvote {votes?.length || 0}
                </>
              )}
              {iVoted && (
                <>
                  Downvote {votes?.length || 0}
                </>
              )}
            </Button>
          )}
          {isVotesLoading && (
            <MoonLoader size={20} color={"#000"} loading={isVotesLoading} />
          )}
        </div>
        
        <div>
          <FeedbackItemPopupComments feedbackId={id} />
        </div>
      </div>
    </Popup>
  );
};

export default FeedbackItemPopup;
