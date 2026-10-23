import { MovieDetail, RecommendedMovieDetail } from "@/types/movieResponseType"
import React, { JSX, JSXElementConstructor, Suspense } from "react"

interface PageProps {
    params : Promise<{id:string}>
}

async function get_movie_details(id : string) : Promise<MovieDetail | "error">{
    try {
        const url = `https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev/movie?id=${id}`
        const res = await fetch(url)
        const resp = await res.json()
        return resp;
    } catch {
        return "error"
    }
}

async function get_movie_recommendations(id : number) : Promise<RecommendedMovieDetail | "error"> {
    try {
        const url = `http://localhost:8000/recommend`
        const payload = {
            id : id,
            top_n : 10
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tells the server the payload is JSON
            },
            body: JSON.stringify(payload
            ) // Converts JavaScript object to a JSON string
        });
        const data = await res.json()
        console.log(data)
        return data
    } catch {
        return "error"
    }
}



function TMDBImage({ image_path ,className,width }: 
    {   
        image_path : any , 
        className:string | undefined, 
        width: number | string
    }) 
{
    if(width!="original")
        width = "w" + width

    console.log(image_path)
    
    return (
        <img
            src={`https://image.tmdb.org/t/p/${width}${image_path}`}
            alt="Movie poster"
            className={className}
        />
    );
}

export function Badge({className,children,measure,emoji}:
    {className:string|undefined,
        children:React.ReactNode,
        measure:string,
        emoji:string
    }){
    return <div className={"rounded-md px-4 py-2 flex flex-col items-center  " + className}>
        <p className="text-md text-neutral-500"> {emoji} {measure} </p>
        <p className="text-lg font-bold">
            {children}
        </p>
    </div>
}

function formatCount(num: number): string {
    if (num < 1000) return num.toString();

    if (num < 100_000) {
        return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }

    if (num < 1_000_000) {
        return `${Math.floor(num / 1000)}K`;
    }

    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export async function Content({params}:PageProps){
    const {id} = await params;
    if(id.length == 0)
        return "Error page"
    const movie_details = await get_movie_details(id);
    if(movie_details=="error")
        return <h1> error page </h1>
    if(!movie_details)
        return "loading"
    console.log(movie_details)
    const recommend_movies = await get_movie_recommendations(Number(id));
    console.log(recommend_movies)
    return <div className="flex p-4 bg-black relative gap-4 sm:gap-10 md:gap-16 lg:gap-24 text-white">
        <div className="absolute z-1 inset-0 inset-x-15 ">
            <div className="bg-linear-to-r from-black via-black/35 to-black absolute inset-0"></div>
            <TMDBImage className="h-full w-full object-cover" width="original" image_path={movie_details.backdrop_path} ></TMDBImage>
        </div>

        <div className={"z-2"}>
            <TMDBImage width="400" className="border-2 border-white/10" image_path={movie_details.poster_path}></TMDBImage>
        </div>
        
        <div className="flex-1 lg:max-w-300  z-3 lg:my-20">
            <div className="lg:flex lg:justify-between items-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold"> {movie_details.title} </h2>
                <div className="lg:flex gap-1">
                    <Badge measure="Vote Average"
                          emoji="📍"
                        className="bg-black/20 z-100"> 

                        {Math.round(movie_details.vote_average*10)/10}/100 
                    </Badge>
                    <Badge measure="Votes"
                          emoji="👥"
                        className="bg-black/20 z-100"> 

                        {formatCount(movie_details.vote_count)}+
                    </Badge>
                    <Badge measure="Popularity"
                          emoji="👀"
                        className="bg-black/20 z-100"> 

                        {Math.round(movie_details.popularity)}/100 
                    </Badge>
                    {/* {movie_details.popularity} */}

                </div>
            </div>
            <div className="mb-10">
                <h5 className=" mt-3 text-xl text-neutral-500">{movie_details.release_date.substring(0,4)} </h5>
                <p className="text-xl text-neutral-300 my-1"> {Math.floor(movie_details.runtime/60)} hrs {(movie_details.runtime%60)} mins </p>
            </div>
            <div className="flex gap-2 mb-6">
                {
                    movie_details.genres.map((genre)=>{
                        return <div key={genre.id} className="border-2 rounded-full px-4">
                            {genre.name}
                        </div>
                    })
                }
            </div>
            <div className="lg:max-w-lg lg:text-xl">
                <p> {movie_details.overview} </p>
            </div>
        </div>
    </div>
}

export default async function Page({params}:PageProps){
    return <Suspense>
        <main>
            <Content params={params}></Content>
        </main>
    </Suspense>
}