import os
from dotenv import load_dotenv
load_dotenv()

env = str(os.getenv("DJANGO_ENV", "dev"))

if env == "prod":
    from .prod import * # noqa
else:
    from .dev import * # noqa
