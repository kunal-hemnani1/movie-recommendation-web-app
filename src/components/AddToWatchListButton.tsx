"use client"
import { addMovieToWatchlist, MovieForWatchlist } from '@/lib/watchlist';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import React from 'react'

function AddToWatchListButton({movie}:{movie:MovieForWatchlist}) {
    const [bookmarked,setBookmarked] = React.useState<boolean>(false)
  return (
        <button className='my-10 flex gap-2 border-1 rounded-sm px-4 py-2' onClick={async () => {
        try {
            setBookmarked(true);
            await addMovieToWatchlist(movie);
            alert("Added to your watchlist");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Could not add movie");
        }
        }}
        >
            { bookmarked ? <BookmarkCheck></BookmarkCheck> : <Bookmark></Bookmark>} Add to watchlist
    </button>
  )
}

export default AddToWatchListButton