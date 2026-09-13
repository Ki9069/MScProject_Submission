import os
import anthropic
from dotenv import load_dotenv 

load_dotenv()
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise RuntimeError("ANTHROPIC_API_KEY is not configured")

client = anthropic.Anthropic(api_key = api_key) 

# Generate and stream story text with Claude 
def generate_story(user_name,user_age,user_interest,word_pair):
    story_prompt = build_story_prompt(user_name,user_age,user_interest,word_pair)
    system_prompt = """
                    You are a friendly Cantonese and Traditional Chinese language tutor
                    creating short, age-appropriate stories for Cantonese heritage learners
                    in the UK.

                    Your goal is to make visually similar Chinese characters easier to
                    remember through a simple, memorable story and mnemonic.
                    """

    #stream generated text to reduce waiting time
    with client.messages.stream(
            model="claude-haiku-4-5",
            max_tokens = 200,
            messages = [{"role":"user", "content":story_prompt}],
            system = system_prompt
        ) as stream:
            for text in stream.text_stream:
                yield text 


# Build a personalised prompt with user and wp data
def build_story_prompt(user_name, user_age, user_interest, word_pair):
    return f"""
    <context>
        <learner>
        Name: {user_name}
        Age: {user_age}
        Interest: {user_interest}
        Background: Cantonese heritage learner living in the UK
        </learner>

        <target_characters>
        {word_pair}
        </target_characters>
    </context>

    <task>
    Create a short, engaging story that helps the learner remember the
    two visually similar Chinese characters.

    The story should feel natural rather than like a language exercise.
    Use a realistic Hong Kong or UK setting, such as a market, school,
    zoo, park, family outing, or everyday home activity.
    </task>

    <story_requirements>
    - Write 5-7 sentences.
    - Keep the story itself under 100 words.
    - Write in plain English suitable for a child.
    - Naturally include the two target Chinese characters.
    - When each target character is first introduced, immediately include its Cantonese Jyutping with tone number in parentheses.
    - Use Cantonese Jyutping only. Never use Mandarin Pinyin.
    - Include relevant UK, Hong Kong, or Cantonese cultural details only when they fit naturally into the story.
    </story_requirements>

    <mnemonic>
    After the story, write a separate paragraph beginning exactly with:

    Mnemonic tip:
    The mnemonic should give the learner a simple visual, shape-based,
    sound-based, or meaning-based association that helps distinguish the
    two characters.

    Keep the mnemonic under 50 words.
    </mnemonic>

    <output_format>
    Return exactly two paragraphs:

    Paragraph 1: The story.
    Paragraph 2: The mnemonic beginning with "Mnemonic tip:"

    Use plain text paragraphs only. Do not use headings, bullet points,
    numbering, Markdown, or quotation marks around the story.
    </output_format>

    <final_check>
    Before responding, verify that:
    - both target characters are included;
    - Jyutping uses Cantonese tone numbers rather than Mandarin Pinyin;
    - the story has 5-7 sentences;
    - the story is under 100 words;
    - the mnemonic is under 50 words;
    - the response contains exactly two plain-text paragraphs.
    </final_check>
    """