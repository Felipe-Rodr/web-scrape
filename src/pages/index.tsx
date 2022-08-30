import { Target } from 'puppeteer';
import React, { useState } from 'react'
import { trpc } from '../utils/trpc';

interface indexProps {

}

const index = ({}:indexProps) => {
    const [Search, setSearch] = useState('rx 6600');
    let MapArray = createMapArray(10);
    const TerabyteAnuncios = trpc.useQuery(['terabyte.getAnuncios',{
        search: Search.trim().replace(' ','+'),
    }],{
        staleTime: Infinity,
        enabled: false
    })
    const PichauAnuncios = trpc.useQuery(['pichau.getAnuncios',{
        search: Search.trim().replace(' ','%20'),
    }],{
        staleTime: Infinity,
        enabled: false
    })
    const handleChange = {
        SearchInput: (e:React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
        },
    }
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        TerabyteAnuncios.refetch();
        PichauAnuncios.refetch();
    }
    console.log(PichauAnuncios)
    return (
        <div className='relative flex flex-col p-5 pt-10'>
            <form className='form-control flex flex-row justify-center pb-5' onSubmit={(e) => handleSubmit(e)}>
                <div className='input-group relative max-w-lg  justify-center'> 
                    <input
                        className="input input-bordered"
                        type='text'
                        placeholder={"Pesquise"}
                        value={Search}
                        onChange={(e) => handleChange.SearchInput(e)}
                    />
                    <button className="btn btn-square max-w-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </form>
            <div className='grid grid-cols-2 grid-rows-1 p-2 mx-5 my-2'>
                <div className='flex flex-col items-center m-1'>
                    <label className='label justify-center max-w-md'>Terabyte</label>
                    <div className='flex flex-col w-full border rounded max-w-md max-h-[80vh] overflow-y-auto p-5'>
                        {(TerabyteAnuncios.isLoading || TerabyteAnuncios.isFetching) && (
                            <label className='label justify-center'>Loading...</label>
                        )}
                        {!(TerabyteAnuncios.isLoading || TerabyteAnuncios.isFetching) && (
                            (TerabyteAnuncios.data && (
                                MapArray.map((Index) => {
                                    let IndexArray = sortPrices(TerabyteAnuncios.data.precoArray)
                                    if(!IndexArray){
                                        return;
                                    }
                                    return(
                                        <div key={Index} className='flex flex-row max-h-[228px] rounded bg-base-200 m-2'>
                                            <a href={TerabyteAnuncios.data.hrefArray[IndexArray[Index]]!} target='_blank'>
                                                <img src={TerabyteAnuncios.data?.imgSrcArray[IndexArray[Index]]!} className='w-[228px] h-[228px] p-2'/>
                                            </a>
                                            <label className='label label-text-alt justify-evenly flex-col max-w-[150px] py-5'>
                                                <p>{TerabyteAnuncios.data.titleArray[IndexArray[Index]]}</p>
                                                {TerabyteAnuncios.data.precoArray[IndexArray[Index]] && (
                                                    <p>Preço: {TerabyteAnuncios.data.precoArray[IndexArray[Index]]} à vista</p>
                                                )}
                                                {!TerabyteAnuncios.data.precoArray[IndexArray[Index]] && (
                                                    <p>Esgotado</p>
                                                )}
                                            </label>
                                        </div>
                                    )
                                })
                            ))
                        )}
                    </div>
                </div>
                <div className='flex flex-col items-center m-1'>
                    <label className='label justify-center max-w-md'>Pichau</label>
                    <div className='flex flex-col w-full border rounded max-w-md max-h-[80vh] overflow-y-auto p-5'>
                        {(PichauAnuncios.isLoading || PichauAnuncios.isFetching) && (
                            <label className='label justify-center'>Loading...</label>
                        )}
                        {!(PichauAnuncios.isLoading || PichauAnuncios.isFetching) && (
                            (PichauAnuncios.data && (
                                MapArray.map((Index) => {
                                    let IndexArray = sortPrices(PichauAnuncios.data.precoArray)
                                    if(!IndexArray){
                                        return;
                                    }
                                    return(
                                        <div key={Index} className='flex flex-row max-h-[228px] rounded bg-base-200 m-2'>
                                            <a href={PichauAnuncios.data.hrefArray[IndexArray[Index]]!} target='_blank'>
                                                <img src={PichauAnuncios.data?.imgSrcArray[IndexArray[Index]]!} className='w-[228px] h-[228px] p-2'/>
                                            </a>
                                            <label className='label label-text-alt justify-evenly flex-col max-w-[150px] py-5'>
                                                <p>{PichauAnuncios.data.titleArray[IndexArray[Index]]}</p>
                                                {PichauAnuncios.data.precoArray[IndexArray[Index]] && (
                                                    <p>Preço: {PichauAnuncios.data.precoArray[IndexArray[Index]]} à vista</p>
                                                )}
                                                {!PichauAnuncios.data.precoArray[IndexArray[Index]] && (
                                                    <p>Esgotado</p>
                                                )}
                                            </label>
                                        </div>
                                    )
                                })
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const sortPrices = (PrecoArray: (string | undefined)[]) => {
    if(PrecoArray){
        const IndexArray = createMapArray(10)
        const newArray = PrecoArray.map((Preco) => {
            if(Preco){
                return Number(Preco
                    .trim()
                    .replace(' ','')
                    .replace('.','')
                    .replace(',','.')
                    .replace('R$', ''));
                
            }
        });
        IndexArray.sort((a,b) => newArray[a]! - newArray[b]!)
        return IndexArray
    }
}

const createMapArray = (SearchLength:number) => {
    const MapArray= [];
    for(let i=0; i<SearchLength; i++){
        MapArray.push(i);
    }
    return MapArray;
}

export default index;