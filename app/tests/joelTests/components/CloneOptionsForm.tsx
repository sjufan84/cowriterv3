import React from 'react'
import { CloneOptions } from '../types/cloneTypes'

interface CloneOptionsFormProps {
  audioURL: string,
  onSubmit: (options: CloneOptions) => void,
}

const CloneOptionsForm = ({ audioURL, onSubmit }: CloneOptionsFormProps) => {
  const [formData, setFormData] = React.useState<CloneOptions>({
    audio_url: audioURL,
    artist: 'Joel',
    protect: 0.33,
    f0up_key: 0,
    index_rate: 0.66,
    filter_radius: 3,
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div id="cloneOptionsForm" className="flex flex-col w-full mt-4">
      <form className="flex flex-col w-full" id="cloneOptionsForm" onSubmit={handleFormSubmit}>
        <label
          className="label label-text-alt font-bold text-[#17123D] mb-2 text-lg"
          htmlFor="artistSelect"
        >
          Select Artist:
        </label>
        <select 
          className="select select-bordered border-blue-900 w-full mb-4" 
          defaultValue="Joel"
          onChange = {(e) => setFormData({...formData, artist: e.target.value})}
        >
          <option value="Joel">Joel</option>
          <option value="Chuck Berry">Chuck Berry</option>
        </select>
        <label className="form-control w-full flex flex-col items-center mb-4">
          <div className="label place-self-start">
            <span className="label-text font-bold text-[#17123D] mb-2 text-lg">Pitch Adjustment:</span>
          </div>
          <input type="range" min={-12} max="12" defaultValue="0" className="range range-sm" step="1" onChange={(e) => setFormData({...formData, f0up_key: Number(e.target.value)})} />
          <div className="w-full flex justify-between text-sm px-2">
            <span>-12</span>
            <span>0</span>
            <span>12</span>
          </div>
        </label>
        <label className="form-control w-full flex flex-col items-center mb-4">
          <div className="label">
            <span className="label-text text-[#17123D] mb-2 text-lg"><strong>Protect:</strong> Protect voiceless consonants and breath sounds to prevent artifacts such as tearing in electronic music. Set to 0.5 to disable. Decrease the value to increase protection, but it may reduce indexing accuracy:<em>  Default 0.33</em></span>
          </div>
          <input type="range" min={0.00} max="0.50" defaultValue="0.33" className="range range-sm" step="0.01" onChange={(e) => setFormData({...formData, protect: Number(e.target.value)})} />
          <div className="w-full flex justify-between text-sm px-2">
            <span>0</span>
            <span>0.5</span>
          </div>
        </label>
        <label className="form-control w-full flex flex-col items-center mb-4">
          <div className="label">
            <span className="label-text text-[#17123D] mb-2 text-lg"><strong>Filter Radius:</strong> If &gt;=3: apply median filtering to the harvested pitch results. The value represents the filter radius and can reduce breathiness.<em>  Default 3.</em></span>
          </div>
          <input type="range" min={0} max="7" defaultValue="3" className="range range-sm" step="1" onChange={(e) => setFormData({...formData, filter_radius: Number(e.target.value)})} />
          <div className="w-full flex justify-between text-sm px-2">
            <span>0</span>
            <span>7</span>
          </div>
        </label>
        <label className="form-control w-full flex flex-col items-center">
          <div className="label">
            <span className="label-text text-[#17123D] mb-2 text-lg"><strong>Search feature ratio:</strong> (controls accent strength, too high has artifacting). <em>  Default 0.66.</em></span>
          </div>
          <input type="range" min={0} max="1.00" defaultValue="0.66" className="range range-sm" step="0.01" onChange={(e) => setFormData({...formData, index_rate: Number(e.target.value)})} />
          <div className="w-full flex justify-between text-sm px-2">
            <span>0</span>
            <span>1</span>
          </div>
        </label>
        <button className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 w-full" type="submit">
          Clone Vocals
        </button>
      </form>
    </div>
  )
}
export default CloneOptionsForm