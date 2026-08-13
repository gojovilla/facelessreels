import asyncio
import edge_tts
import os

audio_dir = os.path.join(os.getcwd(), 'public', 'audio')
os.makedirs(audio_dir, exist_ok=True)

voices_config = [
    # Hindi (FonadaLab) - Real Male & Female Neural Voices
    {
        'file': 'fonada-rohit-hi',
        'voice': 'hi-IN-MadhurNeural', # Clear Authentic Hindi Male Voice
        'text': 'क्या आप जानते हैं कि दुनिया के सबसे अमीर लोग किस गुप्त नियम का पालन करते हैं?'
    },
    {
        'file': 'fonada-priya-hi',
        'voice': 'hi-IN-SwaraNeural', # Clear Authentic Hindi Female Voice
        'text': 'मानव मनोविज्ञान का यह रहस्य आपको हर बातचीत में सफलता दिला सकता है।'
    },
    {
        'file': 'fonada-kabir-hi',
        'voice': 'hi-IN-MadhurNeural', # Clear Authentic Hindi Male Voice
        'text': 'अनुशासन ही वह एकमात्र शक्ति है जो सपनों को हकीकत में बदलती है।'
    },
    {
        'file': 'fonada-neha-hi',
        'voice': 'hi-IN-SwaraNeural', # Clear Authentic Hindi Female Voice
        'text': 'इतिहास की वे रहस्यमयी कहानियां जिन्हें दुनिया से छुपाया गया था।'
    },

    # Marathi (FonadaLab) - Real Male & Female Neural Voices
    {
        'file': 'fonada-aarav-mr',
        'voice': 'mr-IN-ManoharNeural', # Authentic Marathi Male Voice
        'text': 'यशस्वी होण्यासाठी सर्वात महत्त्वाची गोष्ट म्हणजे तुमची शिस्त आणि संयम.'
    },
    {
        'file': 'fonada-tanvi-mr',
        'voice': 'mr-IN-AarohiNeural', # Authentic Marathi Female Voice
        'text': 'जीवनात मोठे ध्येय गाठण्यासाठी दररोज कठोर मेहनत करणे आवश्यक आहे.'
    },

    # Telugu (FonadaLab) - Real Male & Female Neural Voices
    {
        'file': 'fonada-sai-te',
        'voice': 'te-IN-MohanNeural', # Authentic Telugu Male Voice
        'text': 'జీవితంలో విజయం సాధించడానికి క్రమశిక్షణే అతి ముఖ్యమైన ఆయుధం.'
    },
    {
        'file': 'fonada-ananya-te',
        'voice': 'te-IN-ShrutiNeural', # Authentic Telugu Female Voice
        'text': 'మీ జీవితాన్ని మార్చే అత్యంత శక్తివంతమైన మైండ్‌సెట్ రహస్యాలు ఇవే.'
    },

    # English (Deepgram) - Real Male & Female Neural Voices
    {
        'file': 'deepgram-aura-2-odysseus-en',
        'voice': 'en-US-ChristopherNeural', # Deep Baritone American Male Voice
        'text': 'You have power over your mind, not outside events. Realize this, and you will find strength.'
    },
    {
        'file': 'deepgram-aura-2-thalia-en',
        'voice': 'en-US-JennyNeural', # Warm American Female Voice
        'text': 'Here is a secret about human psychology that most people will never tell you.'
    },
    {
        'file': 'deepgram-aura-2-amalthea-en',
        'voice': 'en-US-AriaNeural', # Cinematic Expressive Female Voice
        'text': 'Deep in the darkest depths of the ocean lies a mystery scientists cannot explain.'
    },
    {
        'file': 'deepgram-aura-2-andromeda-en',
        'voice': 'en-US-AvaNeural', # Dramatic Mystery Female Voice
        'text': 'In the year twenty twenty six, artificial intelligence took a leap that changed everything.'
    },
    {
        'file': 'deepgram-aura-2-orion-en',
        'voice': 'en-US-GuyNeural', # Energetic American Male Voice
        'text': 'Here is the exact IRS loophole that billionaires use to legally pay zero tax.'
    },

    # Spanish (Deepgram) - Real Male & Female Neural Voices
    {
        'file': 'deepgram-aura-2-mateo-es',
        'voice': 'es-MX-JorgeNeural', # Authentic Mexican Spanish Male Voice
        'text': 'Descubre el poder de tu mente para dominar cualquier conversación.'
    },
    {
        'file': 'deepgram-aura-2-helen-es',
        'voice': 'es-MX-DaliaNeural', # Authentic Mexican Spanish Female Voice
        'text': 'Este es el misterio psicológico que cambiará por completo cómo ves a las personas.'
    },

    # German (Deepgram) - Real Male & Female Neural Voices
    {
        'file': 'deepgram-aura-2-marcus-de',
        'voice': 'de-DE-ConradNeural', # Authentic German Male Voice
        'text': 'Erkenne die Kraft deiner Gedanken und beherrsche jeden Moment deines Lebens.'
    },
    {
        'file': 'deepgram-aura-2-hannah-de',
        'voice': 'de-DE-KatjaNeural', # Authentic German Female Voice
        'text': 'Hier ist das Geheimnis für unaufhaltsamen Erfolg und eiserne Disziplin.'
    }
]

async def generate_all():
    for item in voices_config:
        mp3_path = os.path.join(audio_dir, item['file'] + '.mp3')
        wav_path = os.path.join(audio_dir, item['file'] + '.wav')
        
        communicate = edge_tts.Communicate(item['text'], item['voice'])
        await communicate.save(mp3_path)
        
        with open(mp3_path, 'rb') as f:
            data = f.read()
        with open(wav_path, 'wb') as f:
            f.write(data)
            
        print(f"Generated {item['file']} with {item['voice']} ({len(data)} bytes)")

if __name__ == '__main__':
    asyncio.run(generate_all())
    print("ALL AI neural male and female voice audio files generated successfully!")
